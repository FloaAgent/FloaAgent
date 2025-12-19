const TrustedBySection = () => {
  
  const sectionData = Array.from({ length: 33 }, (_, index) => ({
    logo: `/img/agent-transparency/${index + 1}.png`,
  }));

  
  const duplicatedPartners = [...sectionData, ...sectionData];

  return (
    <>
      <div className="w-full mx-auto">
        <div className="partner-group relative overflow-hidden">
          <div className="absolute left-0 top-0 w-30 h-full bg-gradient-to-r from-black/50 to-transparent z-10" />
          <div className="absolute right-0 top-0 w-30 h-full bg-gradient-to-l from-black/50 to-transparent z-10" />

          <div className="inline-flex AgentsCarousel">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`forward-${index}`}
                className="partner-logo flex-shrink-0 p-4"
              >
                <div className="w-[200px] h-[200px] p-2 flex items-center justify-center bg-linear-to-b from-[#CC9100] to-[#C2590C] rounded-xl">
                  <img
                    src={partner.logo}
                    alt={`forward-${index}`}
                    className="max-w-full max-h-full object-scale-down"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
@keyframes infinite-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

@keyframes infinite-scroll-reverse {
  0% {
    transform: translateX(-50%);
  }

  100% {
    transform: translateX(0);
  }
}

.AgentsCarousel {
  animation: infinite-scroll 60s linear infinite;
}

.AgentsCarousel-reverse {
  animation: infinite-scroll-reverse 60s linear infinite;
}

.partner-group:hover .AgentsCarousel,
.partner-group:hover .AgentsCarousel-reverse {
  animation-play-state: paused;
}

.partner-logo {
  transition: all 0.3s ease;
}

.partner-logo:hover {
  transform: scale(1.15);
  filter: grayscale(0) !important;
  opacity: 1 !important;
}
          `}
      </style>
    </>
  );
};

export default TrustedBySection;
