import React from 'react';

const partnersData = [
  {
    category: "Pants",
    brands: ["Nike", "Gucci", "LV", "Adidas", "Zara", "H&M", "Levi’s"]
  },
  {
    category: "Jackets",
    brands: ["North Face", "Nike", "Adidas"]
  },
  {
    category: "Sneakers",
    brands: ["Nike", "Adidas", "Puma", "New Balance"]
  },
  {
    category: "Hoodies",
    brands: ["Nike", "Essentials", "GAP", "Adidas", "Zara"]
  },
  {
    category: "T-Shirts",
    brands: ["Lacoste", "Nike", "Adidas", "Uniqlo", "Puma"]
  },
  {
    category: "Shirts",
    brands: ["Zara", "H&M", "Uniqlo"]
  }
];

const Partners = () => {
  return (
    <div className='flex flex-col justify-center items-center mb-20'>
      <h2 className='text-3xl md:text-4xl font-black scale-y-200 mb-9 uppercase'>
        Our Trusted Partners
      </h2>

      <div className='flex flex-col gap-5'>
        {partnersData.map((item, index) => (
          <div key={index} className='text-sm text-gray-500 flex gap-4 text-center'>
            <span className="font-semibold min-w-[90px]">
              {item.category}
            </span>
            <span>
              {item.brands.join(" - ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
