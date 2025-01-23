import React from 'react'
import Map from './components/map'
import Map1 from './components/map1'
import Map2 from './components/map2'

function page() {
    const url1 = "http://localhost:8000/media/kml/Delhi_E-S.kml";
    const url2 = "http://localhost:8000/media/kml/Delhi_E-S(blue_line).kml";
    const url3 = "http://localhost:8000/media/kml/geotagged_road_furniture.kml";
    return (
        <div className='w-full h-screen flex gap-10'>
            <Map url={url1} />
            <Map url={url2} />
            <Map1 url={url3} />
            <Map2 urls={[url1, url3]} />
        </div>
    )
}

export default page
