import Header from "../components/Header";
import HomeHero from "./MainPage/Herosection";
import LatestNews from "./MainPage/LatestNews";
import Slider from "./MainPage/Slider";
import UpgradeSection from "./MainPage/UpgradeSection";


export default function MainPage() {
  return (
    <div>
      <Header />
      <div className="pt-20 px-4 md:px-8 text-white bg-[#0a0a0f] min-h-screen">
        <Slider /><br />
        <HomeHero />
        <LatestNews />
        <UpgradeSection/>
        {/* below you can add: <LatestNews />, <PostsSection />, <Trailers />, etc */}
      </div>
    </div>
  );
}
