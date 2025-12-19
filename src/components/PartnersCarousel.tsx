const TrustedBySection = () => {
  const sectionData = [
    
    
    
    
    
    
    
    
    
    
    { logo: "/img/partners/11.png" },
    { logo: "/img/partners/12.png" },
    { logo: "/img/partners/13.png" },
  ];

  
  const duplicatedPartners = [...sectionData];

  return (
    <>
      <div className="w-full mx-auto">
        <div className="partner-group relative overflow-hidden">
          <div className="absolute left-0 top-0 w-30 h-full bg-gradient-to-r from-[#1e110450] to-transparent z-10" />
          <div className="absolute right-0 top-0 w-30 h-full bg-gradient-to-l from-[#1e110450] to-transparent z-10" />

          <div className="flex justify-center items-center">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`forward-${index}`}
                className="partner-logo flex-shrink-0 p-4"
              >
                <div className="w-[350px]">
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
        {}
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

.PartnersCarousel {
  animation: infinite-scroll 40s linear infinite;
}

.PartnersCarousel-reverse {
  animation: infinite-scroll-reverse 40s linear infinite;
}

.partner-group:hover .PartnersCarousel,
.partner-group:hover .PartnersCarousel-reverse {
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
