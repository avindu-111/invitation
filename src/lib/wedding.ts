import p1 from "@/assets/p1.png.asset.json";
import p2 from "@/assets/p2.jpg.asset.json";
import p3 from "@/assets/p3.jpg.asset.json";
import p4 from "@/assets/p4.jpg.asset.json";

// Ceremony: Wednesday 20 January 2027, 9:00 AM Sri Lanka time
export const CEREMONY_ISO = "2027-01-20T09:00:00+05:30";

export const HERO_PHOTO = p1.url;

// Add more photos here to grow the gallery
export const GALLERY = [
  { src: p1.url, caption: "Above the clouds" },
  { src: p4.url, caption: "Blooms & smiles" },
  { src: p2.url, caption: "Coffee dates" },
  { src: p3.url, caption: "Our happy place" },
];

export const VENUE = {
  name: "Ruwanara Royal Majestry",
  town: "Narammala",
  lat: 7.4096942,
  lng: 80.2057845,
  link: "https://www.google.com/maps/place/Ruwanara+Royal+Majestry/@7.4096942,80.2057845,17z",
};

export function timeLeft(target: number, now: number) {
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
}
