import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración del icono
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function Mapa() {
  // Coordenadas de Corregidora, Querétaro
  const position = [20.5407, -100.4443]; 

  return (
    <MapContainer center={position} zoom={15} style={{ height: "380px", width: "100%", borderRadius: "8px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Lavandería El Fénix</Popup>
      </Marker>
    </MapContainer>
  );
}

export default Mapa;