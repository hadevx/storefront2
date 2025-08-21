import React from "react";
import Lottie from "lottie-react";
import characterAnimation from "./newMaintenance.json"; // Place your JSON file here

const Maintenance = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md lg:max-w-2xl mx-auto border border-blue-200">
        {/* Lottie animation container */}
        <div className="lg:w-[500px]  h-auto mx-auto ">
          <Lottie animationData={characterAnimation} loop={true} />
        </div>

        <h1
          style={{ fontFamily: "webschema, sans-serif" }}
          className=" text-4xl font-extrabold text-rose-500 mb-4 ">
          {" "}
          صيانة
        </h1>
        <p className=" lg:text-lg text-gray-700 mb-6 leading-relaxed ">
          أهلا يا صديقي. نحن نقوم حاليًا بأعمال صيانة لتحسين تجربتك معنا. شكراً لصبرك وتفهمك، ونعدك
          بأننا سنعود قريبًا! إذا كنت بحاجة إلى مساعدة عاجلة، لا تتردد في التواصل معنا.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
