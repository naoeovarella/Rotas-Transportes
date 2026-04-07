/**
 * Serviço de rotas local — sem API externa.
 * Seleciona rotas com base em palavras-chave da origem/destino.
 */

const TRANSIT_LINES = [
  { type: 'SUBWAY', name: 'Linha 2 - Verde',       shortName: 'L2',   color: '#007E5E', vehicle: 'Metrô',  badge: 'M' },
  { type: 'SUBWAY', name: 'Linha 3 - Vermelha',    shortName: 'L3',   color: '#EE1D23', vehicle: 'Metrô',  badge: 'M' },
  { type: 'BUS',    name: '8012-10 Exp. Paulista',  shortName: '8012', color: '#2E7D32', vehicle: 'Ônibus', badge: 'Ô' },
  { type: 'BUS',    name: '7181-10 Centro',         shortName: '7181', color: '#1B5E20', vehicle: 'Ônibus', badge: 'Ô' },
  { type: 'TRAIN',  name: 'CPTM Linha 7 - Rubi',   shortName: 'L7',   color: '#6A1B9A', vehicle: 'Trem',   badge: 'T' },
  { type: 'TRAIN',  name: 'CPTM Linha 11 - Coral', shortName: 'L11',  color: '#FF6600', vehicle: 'Trem',   badge: 'T' },
];

const ALL_TEMPLATES = [
  { id: 't0', lineIndex: 0, walkBefore: 5,  transit: 28, walkAfter: 7,  distanceKm: 11.2, numStops: 6 },
  { id: 't1', lineIndex: 1, walkBefore: 4,  transit: 22, walkAfter: 6,  distanceKm: 9.5,  numStops: 5 },
  { id: 't2', lineIndex: 2, walkBefore: 3,  transit: 42, walkAfter: 5,  distanceKm: 8.7,  numStops: null },
  { id: 't3', lineIndex: 3, walkBefore: 6,  transit: 38, walkAfter: 8,  distanceKm: 7.3,  numStops: null },
  { id: 't4', lineIndex: 4, walkBefore: 8,  transit: 35, walkAfter: 10, distanceKm: 16.4, numStops: 4 },
  { id: 't5', lineIndex: 5, walkBefore: 10, transit: 45, walkAfter: 12, distanceKm: 21.0, numStops: 7 },
];

function selectTemplates(origin, destination) {
  const text = `${origin} ${destination}`.toLowerCase();

  const isCentro   = /centro|sé|república|luz|anhangabaú|brás/.test(text);
  const isPaulista = /paulista|consolação|bela vista|jardins|trianon/.test(text);
  const isTatuape  = /tatuapé|penha|aricanduva|carrão/.test(text);
  const isSantana  = /santana|tucuruvi|mandaqui|carandiru/.test(text);
  const isVilaOlim = /vila olímpia|brooklin|itaim|berrini/.test(text);
  const isPinheiro = /pinheiros|vila madalena|fradique/.test(text);

  if (isCentro && isPaulista) return [ALL_TEMPLATES[0], ALL_TEMPLATES[2], ALL_TEMPLATES[4]];
  if (isCentro)               return [ALL_TEMPLATES[1], ALL_TEMPLATES[3], ALL_TEMPLATES[4]];
  if (isPaulista)             return [ALL_TEMPLATES[0], ALL_TEMPLATES[2], ALL_TEMPLATES[5]];
  if (isTatuape)              return [ALL_TEMPLATES[1], ALL_TEMPLATES[4], ALL_TEMPLATES[2]];
  if (isSantana)              return [ALL_TEMPLATES[0], ALL_TEMPLATES[5], ALL_TEMPLATES[3]];
  if (isVilaOlim)             return [ALL_TEMPLATES[0], ALL_TEMPLATES[2], ALL_TEMPLATES[3]];
  if (isPinheiro)             return [ALL_TEMPLATES[1], ALL_TEMPLATES[2], ALL_TEMPLATES[4]];

  return [ALL_TEMPLATES[0], ALL_TEMPLATES[2], ALL_TEMPLATES[4]]; // padrão
}

function formatDuration(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function addMins(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export async function fetchRoutes(origin, destination) {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const templates = selectTemplates(origin, destination);
  const baseTime  = new Date();

  return templates.map((tpl, index) => {
    const line      = TRANSIT_LINES[tpl.lineIndex];
    const totalMins = tpl.walkBefore + tpl.transit + tpl.walkAfter;

    const departure        = addMins(baseTime, 2 + index * 6);
    const arrival          = addMins(departure, totalMins);
    const transitDeparture = addMins(departure, tpl.walkBefore);
    const transitArrival   = addMins(transitDeparture, tpl.transit);

    const steps = [
      {
        type: 'walking',
        instruction: `Caminhe até o ponto de ${line.vehicle}`,
        duration: formatDuration(tpl.walkBefore),
        distance: `${(tpl.walkBefore * 0.08).toFixed(1)} km`,
      },
      {
        type: 'transit',
        instruction: `Embarque em ${line.name}`,
        duration: formatDuration(tpl.transit),
        distance: `${(tpl.distanceKm * 0.85).toFixed(1)} km`,
        transitLine: line.shortName,
        vehicle: line.type,
        vehicleName: line.vehicle,
        lineColor: line.color,
        badge: line.badge,
        numStops: tpl.numStops,
        departureStop: origin,
        arrivalStop: destination,
        departureTime: formatTime(transitDeparture),
        arrivalTime: formatTime(transitArrival),
      },
      {
        type: 'walking',
        instruction: 'Caminhe até o destino',
        duration: formatDuration(tpl.walkAfter),
        distance: `${(tpl.walkAfter * 0.08).toFixed(1)} km`,
      },
    ];

    return {
      id: tpl.id,
      origin,
      destination,
      duration: formatDuration(totalMins),
      durationValue: totalMins,
      distance: `${tpl.distanceKm} km`,
      departureTime: formatTime(departure),
      arrivalTime: formatTime(arrival),
      transitLine: line.name,
      transitType: line.vehicle,
      lineColor: line.color,
      badge: line.badge,
      steps,
    };
  });
}
