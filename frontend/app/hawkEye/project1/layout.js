
import CarouselComp from "../components/CarouselCompRender";
export default function RootLayout({ children }) {
  return (

    <div>
      <div className="w-full max-w-sm m-auto"><CarouselComp /></div>
      {children}

    </div>

  );
}
