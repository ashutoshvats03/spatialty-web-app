// "use client";
// import { useEffect, useState, React } from 'react'
// import RoadFurniture from './components/RoadFurniture'
// import StreetLight from './components/StreetLight'
// import axios from 'axios';
// import {useRouter} from "next/navigation"

// function page() {
//     const router = useRouter();
//     const [array1, setArray1] = useState(null);
//     const [array2, setArray2] = useState(null);
//     const [isMounted, setIsMounted] = useState(false);

//     useEffect(() => {
//         if (localStorage.getItem("data") !== null) {
//             const a1 = JSON.parse(localStorage.getItem("data")).Road_Furniture;
//             const a2 = JSON.parse(localStorage.getItem("data")).Street_Light;
//             setArray1(a1);
//             setArray2(a2);
//             setIsMounted(true);
//         }
//         else{
//             router.push("/")
//         }
        
//     }, []);
//     if (!isMounted) {
//         return <div>Loading vegetation</div>;
//     }
//     return (
//         <div className='w-full h-[400px] flex flex-col gap-24 my-20'>
//             {array1 && array2 && (
//                 <>
//                     <RoadFurniture array={array1} />
//                     <StreetLight array={array2} />
//                 </>
//             )}


//         </div>
//     )
// }

// export default page



import React from 'react'

function page() {
  return (
    <div>
      
    </div>
  )
}

export default page




// "use client";
// import React from 'react'
// import RoadFurniture from './components/RoadFurniture'
// import StreetLight from './components/StreetLight'
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// function page() {
//     const [array1, setArray1] = useState(null);
//     const [array2, setArray2] = useState(null);

//     if(localStorage.getItem("data")!==null){
//         setArray1(JSON.parse(localStorage.getItem("data")).Road_Furniture);
//         setArray2(JSON.parse(localStorage.getItem("data")).Street_Light);
//     }
//     else{
//         return <div>Loading vegetation</div>
//     }
//     return (
//         <div className='w-full h-[400px] flex flex-col gap-24 my-20'>
//             {array1 && array2 && (
//                 <>
//                     <RoadFurniture array={array1} />
//                     <StreetLight array={array2} />
//                 </>
//             )}


//         </div>
//     )
// }

// export default page
