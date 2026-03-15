function AppBackground() {
  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none bg-black overflow-hidden">
      <div
        className="absolute inset-[-200px] star-layer-slow"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,1), transparent 55%), radial-gradient(1px 1px at 110px 70px, rgba(255,255,255,0.9), transparent 55%), radial-gradient(1px 1px at 170px 120px, rgba(255,255,255,1), transparent 55%), radial-gradient(2px 2px at 80px 160px, rgba(255,255,255,0.85), transparent 60%), radial-gradient(2px 2px at 220px 40px, rgba(255,255,255,0.75), transparent 60%)",
          backgroundSize: "260px 220px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="absolute inset-[-220px] star-layer-fast opacity-85"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 35px 40px, rgba(255,255,255,0.95), transparent 55%), radial-gradient(1px 1px at 140px 95px, rgba(255,255,255,0.8), transparent 55%), radial-gradient(2px 2px at 200px 150px, rgba(255,255,255,0.72), transparent 60%), radial-gradient(1px 1px at 90px 180px, rgba(255,255,255,0.9), transparent 55%), radial-gradient(2px 2px at 250px 220px, rgba(255,255,255,0.65), transparent 60%)",
          backgroundSize: "280px 240px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="absolute inset-[-260px] star-layer-streak opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(2px 2px at 45px 45px, rgba(255,255,255,0.95), transparent 60%), radial-gradient(2px 2px at 190px 110px, rgba(255,255,255,0.85), transparent 60%), radial-gradient(3px 3px at 320px 210px, rgba(255,255,255,0.7), transparent 65%), radial-gradient(2px 2px at 420px 80px, rgba(255,255,255,0.9), transparent 60%)",
          backgroundSize: "460px 300px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

export default AppBackground;
