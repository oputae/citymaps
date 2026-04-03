import type { Map as MapLibreMap } from "maplibre-gl";

export type LayerToggles = {
  roads: boolean;
  labels: boolean;
  water: boolean;
};

function setGroup(map: MapLibreMap, match: (id: string) => boolean, visible: boolean) {
  const layers = map.getStyle()?.layers;
  if (!layers) return;
  const vis = visible ? "visible" : "none";
  for (const layer of layers) {
    if (match(layer.id)) {
      try {
        map.setLayoutProperty(layer.id, "visibility", vis);
      } catch {
        /* layer may not support visibility */
      }
    }
  }
}

/** Best-effort toggles for common OpenMapTiles / Liberty-style layer ids. */
export function applyLayerToggles(map: MapLibreMap, toggles: LayerToggles) {
  setGroup(map, (id) => /water|ocean|river|sea|dock|wetland|basin/i.test(id), toggles.water);
  setGroup(
    map,
    (id) =>
      /road|street|highway|transport|tunnel|bridge|aerialway|rail/i.test(id) &&
      !/label|shield|name|waterway/i.test(id),
    toggles.roads,
  );
  setGroup(map, (id) => /label|place|name|poi|housenumber|road[_-]?name|settlement/i.test(id), toggles.labels);
}
