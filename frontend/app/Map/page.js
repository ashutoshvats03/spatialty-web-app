import React from 'react'
// import Map from './components/Line'
import Map1 from './components/Point'
import Map2 from './components/Line_Point'
import Map from './components/Multi'

function page() {
    const url1 = "http://localhost:8000/media/kml/Delhi_E-S.kml";
    const url2 = "http://localhost:8000/media/kml/Delhi_E-S(blue_line).kml";
    const url3 = "http://localhost:8000/media/kml/geotagged_road_furniture.kml";
    // const url = "http://localhost:8000/media/kml/Road_Defects.kml";
    const url = "http://localhost:8000/media/kml/Road_Defects(No defects removed).kml"
    return (
        <div className='w-full h-screen flex gap-10'>
            {/* <Map url={url1} />
            <Map url={url2} />
            <Map1 url={url3} />
            <Map2 urls={[url1, url3]} /> */}
            <Map url={url} />
        </div>
    )
}

export default page
