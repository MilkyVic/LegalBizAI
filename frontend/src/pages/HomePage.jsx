import robot_img from "../assets/robot_image.png";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full bg-gradient-to-r from-orange-100 to-[#e5bc8b]">
      <div className="text-center p-4 flex-grow flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <img
            className="block w-[150px] sm:w-[200px] h-auto mb-6"
            src={robot_img}
            alt="LegalBizAI"
          />
          <h1 className="text-2xl lg:text-4xl font-bold" style={{ color: 'rgb(217 131 87)' }}>
            Xin chào! Mình là
          </h1>
          <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            LegalBizAI Chat
          </h1>
          <p className="py-6 font-semibold text-sm lg:text-lg">
            Giúp bạn giải đáp thắc mắc về luật doanh nghiệp, tra cứu thông tin pháp lý một cách nhanh chóng!
          </p>
          <Link to="/chat">
            <button className="btn btn-info bg-gradient-to-r from-orange-400 to-orange-600 text-white">
              Bắt đầu ngay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
