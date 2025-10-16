import React from 'react';
import { MapContainer, TileLayer, Circle, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getRiskColor = (level) => {
    switch (level) {
        case 'Critical': return '#ef4444'; // red-500
        case 'High': return '#f97316';     // orange-500
        case 'Medium': return '#f59e0b';   // amber-500
        case 'Low': return '#22c55e';      // green-500
        default: return '#6b7280';         // gray-500
    }
};

export default function Heatmap({ hotspots }) {
    const defaultPosition = hotspots.length > 0
        ? [hotspots[0].center_coordinates.latitude, hotspots[0].center_coordinates.longitude]
        : [40.7128, -74.0060]; // Fallback to NYC

    return (
        <MapContainer center={defaultPosition} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {hotspots.map((hotspot) => (
                <Circle
                    key={hotspot.id}
                    center={[hotspot.center_coordinates.latitude, hotspot.center_coordinates.longitude]}
                    radius={hotspot.radius_meters}
                    pathOptions={{
                        color: getRiskColor(hotspot.risk_level),
                        fillColor: getRiskColor(hotspot.risk_level),
                        fillOpacity: 0.3
                    }}
                >
                    <Popup>
                        <div>
                            <h3 className="font-bold text-lg">{hotspot.risk_level} Risk Hotspot</h3>
                            <p><strong>Dominant Crimes:</strong> {hotspot.dominant_crime_types.join(', ')}</p>
                            <p><strong>Active Hours:</strong> {hotspot.active_hours.join(', ')}</p>
                            <p><strong>AI Recommendation:</strong> {hotspot.patrol_recommendation}</p>
                        </div>
                    </Popup>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                        {hotspot.risk_level}
                    </Tooltip>
                </Circle>
            ))}
        </MapContainer>
    );
}