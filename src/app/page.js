import Navbar from "./components/Navbar";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-white flex flex-col justify-center items-center min-h-[40vh] py-12">
          <div className="font-bold flex items-center text-3xl md:text-5xl lg:text-6xl text-center">
            House Building Requirements
            <span className="ml-4">
              <img className="invertImg" src="/tea.gif" width={88} alt="" />
            </span>
          </div>
          <p className="p-4 text-lg md:text-xl text-center max-w-2xl text-gray-300">
            A platform to know the materials required to construct your Dream House
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href={"/Login"}>
              <button
                type="button"
                className="text-white cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-8 py-3 text-center transition-all duration-300 transform hover:scale-105"
              >
                Business
              </button>
            </Link>
            <Link href="/about">
              <button
                type="button"
                className="text-white cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-8 py-3 text-center transition-all duration-300 transform hover:scale-105"
              >
                Read More
              </button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-white h-px opacity-10 w-full my-8"></div>

        {/* CTA Section */}
        <div className="text-white text-3xl md:text-4xl font-bold my-12 text-center">
          Need Help to Build Your Dream House
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-around gap-8 my-8">
          <div className="w-full lg:w-1/2 flex justify-center">
            <img 
              className="w-full max-w-lg rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3yTPYnP18dd01BjwbyB6cyeSJ1QqJzFLCZw&s" 
              alt="Dream house illustration" 
            />
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <Link href="/area">
              <button
                type="button"
                className="mt-6 lg:mt-0 cursor-pointer text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-12 py-4 text-center transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-white h-px opacity-10 w-full my-8"></div>

        {/* Video Section */}
        <div className="text-white container mx-auto pb-20 pt-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-center mb-12">Learn More About Us</h2>
          <div className="w-full aspect-video max-w-4xl rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/ojuUnfqnUI0?si=wMUv4DG3ia6Wt4zn"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}