import React from 'react'
// import Map from './components/Line'
import Map1 from './components/Point'
import Map2 from './components/Line_Point'
import Map from './components/Multi'
import Element from "./components/map"

function page() {
    // const url1 = "http://localhost:8000/media/kml/Delhi_E-S.kml";
    // const url2 = "http://localhost:8000/media/kml/Delhi_E-S(blue_line).kml";
    // const url3 = "http://localhost:8000/media/kml/geotagged_road_furniture.kml";
    // // const url = "http://localhost:8000/media/kml/Road_Defects.kml";
    // const url = "http://localhost:8000/media/kml/Road_Defects(No defects removed).kml"
    const url1 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Alligator_crack.kml";
    const url2 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Bleeding_severity-based.kml";
    const url3 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Cracking_severity-based.kml";
    const url4 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Depression_severity-based.kml";
    const url5 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Edge_crack_severity-based.kml";
    const url6 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Longitudinal_crack.kml";
    const url7 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Patch_work_severity-based.kml";
    const url8 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Potholes_severity-based.kml";
    const url9 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Raveling_severity-based.kml";
    const url10 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Rutting.kml";
    const url11 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Shoving_severity-based.kml";
    const url12 = "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Transverse_crack.kml";

    const color = "rgba(0, 128, 0, 1)"
    return (
        <div className='w-full h-screen flex gap-10'>
            {/* <Map url={url1} />
            <Map url={url2} />
            <Map1 url={url3} />
            <Map2 urls={[url1, url3]} /> */}
            <Map url={url1} />
            <Map url={url2} />
            <Map url={url3} />
            <Map url={url4} />
            <Map url={url5} />
            <Map url={url6} />
            {/* <Element url={url} selectedColor={color} /> */}
        </div>
    )
}

export default page
