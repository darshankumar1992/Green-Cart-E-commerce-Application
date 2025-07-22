import leaf from "../assets/leaf_icon.svg"
import coin from "../assets/coin_icon.svg"
import trust from "../assets/trust_icon.svg"
import vegetable_img from "../assets/fresh_veg.png"
import fruit_img from "../assets/fresh_fruit.png"
import grain_img from "../assets/grain_image.png"
import plant_img from "../assets/plant_image.png"
import seeds_img from "../assets/seeds_image.png"



export const features = [
  
   {
      icon: leaf,
      title: "Freshness Guaranteed",
      description: "Fresh produce straight from the source.",
    },
    {
      icon: coin,
      title: "Affordable Prices",
      description: "Quality groceries at unbeatable prices.",
    },
    {
      icon: trust,
      title: "Trusted by Thousands",
      description: "Loved by 10,000+ happy customers.",
    },
  
];

export const footer = [
  {
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
  },
  
  {
      title: "Follow Us",
      links: ["Instagram", "Twitter", "Facebook", "YouTube"]
  }
];


export const categories = [
  {
    text: "Organic veggies",
    category: "vegetable",
    image: vegetable_img,
    bgColor: "#FEF6DA",
  },
  {
    text: "Fresh Fruits",
    category: "fruit",
    image: fruit_img,
    bgColor: "#FEE0E0",
  },
  {
    text: "Grains & Cereals",
    category: "grain",
    image: grain_img,
    bgColor: "#F1E3F9",
  },

  {
    text: "Plants",
    category: "plant",
    image: plant_img,
    bgColor: "#E1F5EC"
  },

  {
    text: "Seeds",
    category: "seed",
    image: seeds_img,
    bgColor: "#E0F6FE"
    
  }
];