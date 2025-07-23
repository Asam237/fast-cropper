import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImageCropper from "@/components/ImageCropper";
import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <Header />
      <main className="flex-1">
        <ImageCropper />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
