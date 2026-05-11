'use client'

import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

const VENUE_COORDS = { longitude: -9.0938, latitude: 38.7693 }

export default function VenueMap() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!token) {
    return (
      <div className="w-full h-full bg-bg-surface flex items-center justify-center border border-white/10 rounded-xl">
        <p className="text-text-muted text-sm text-center px-4">
          Mapa disponível em breve<br />
          <span className="text-xs opacity-50">Configure NEXT_PUBLIC_MAPBOX_TOKEN</span>
        </p>
      </div>
    )
  }

  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{ ...VENUE_COORDS, zoom: 14 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      <Marker longitude={VENUE_COORDS.longitude} latitude={VENUE_COORDS.latitude}>
        <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-bg-primary font-bold text-sm shadow-lg">
          ⚽
        </div>
      </Marker>
    </Map>
  )
}
