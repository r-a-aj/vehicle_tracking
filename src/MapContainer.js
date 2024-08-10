import React, { useEffect, useRef, useState, useMemo } from 'react';

const MapContainer = () => {
  const googleMapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [vehicleMarker, setVehicleMarker] = useState(null);
  const [polyline, setPolyline] = useState(null);

  // Memoize the startPoint so it doesn't cause re-renders unnecessarily
  const startPoint = useMemo(() => ({ lat: 17.385044, lng: 78.486671 }), []);

  useEffect(() => {
    const googleMap = new window.google.maps.Map(googleMapRef.current, {
      center: startPoint,
      zoom: 12,
    });
    setMap(googleMap);

    // Draw start marker
    new window.google.maps.Marker({
      position: startPoint,
      map: googleMap,
      label: 'Start',
    });
  }, [startPoint]);

  useEffect(() => {
    if (!map) return;

    const handleClick = (event) => {
      // Remove previous end marker, vehicle marker, and polyline if they exist
      if (marker) marker.setMap(null);
      if (vehicleMarker) vehicleMarker.setMap(null);
      if (polyline) polyline.setMap(null);

      const endPoint = event.latLng;

      // Draw end marker
      const newMarker = new window.google.maps.Marker({
        position: endPoint,
        map,
        label: 'End',
      });
      setMarker(newMarker);

      // Draw polyline between start and end
      const newPolyline = new window.google.maps.Polyline({
        path: [startPoint, endPoint],
        map,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      setPolyline(newPolyline);

      // Draw vehicle marker and animate movement
      const newVehicleMarker = new window.google.maps.Marker({
        position: startPoint,
        map,
        icon: {
          url: 'vehicle.png', // Ensure this path is correct
          scaledSize: new window.google.maps.Size(50, 50),
        },
      });
      setVehicleMarker(newVehicleMarker);

      animatedMove(newVehicleMarker, startPoint, endPoint, 3);
    };

    // Add event listener for map clicks
    map.addListener('click', handleClick);

    return () => {
      // Cleanup event listener on component unmount
      window.google.maps.event.clearListeners(map, 'click');
    };
  }, [map, marker, vehicleMarker, polyline, startPoint]);

  const animatedMove = (marker, moveFrom, moveTo, t, delta = 1000) => {
    const deltalat = (moveTo.lat() - moveFrom.lat) / delta;
    const deltalng = (moveTo.lng() - moveFrom.lng) / delta;
    let delay = 10 * t;
  
    for (let i = 0; i < delta; i++) {
      setTimeout(() => {
        const lat = marker.position.lat() + deltalat;
        const lng = marker.position.lng() + deltalng;
        marker.setPosition(new window.google.maps.LatLng(lat, lng));
      }, delay * i);
    }
  };

  return <div ref={googleMapRef} style={{ width: 1520, height: 760 }} />;
};

export default MapContainer;



