import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Facebook, Instagram } from 'lucide-react';


const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className=" bg-[#0a151e]">
      <div className="container pt-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className=' leading-tight'>
            <span className="font-heading text-xl lg:text-2xl font-bold text-primary">
            <span className='text-gray-200'>Miskiner</span>basha
          </span>
          <p className='text-xs -mt-1 text-gray-200'>Student housing</p>
          </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping students find affordable rooms in Dhaka since 2024. 
              Your trusted platform for student housing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-heading font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/search" className="hover:text-primary transition-colors">
                  Find Rooms
                </Link>
              </li>
              <li>
                <Link to="/list-room" className="hover:text-primary transition-colors">
                  List Your Room
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h4 className="mb-4 font-heading font-semibold">Popular Areas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/search?area=Dhanmondi" className="hover:text-primary transition-colors">
                  Dhanmondi
                </Link>
              </li>
              <li>
                <Link to="/search?area=Mirpur" className="hover:text-primary transition-colors">
                  Mirpur
                </Link>
              </li>
              <li>
                <Link to="/search?area=Uttara" className="hover:text-primary transition-colors">
                  Uttara
                </Link>
              </li>
              <li>
                <Link to="/search?area=Bashundhara" className="hover:text-primary transition-colors">
                  Bashundhara
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-heading font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@miskinerbasha.com" className="hover:text-primary transition-colors">
                  hello@miskinerbasha.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+8801700000000" className="hover:text-primary transition-colors">
                  +880 1700 000 000
                </a>
              </li>
              <li className="flex items-center gap-4 pt-2">
                <a href="#" className="hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Miskinerbasha.</p>
        </div>
        
      </div>
      <small className='text-center block text-muted-foreground '>Developed by <Link className='text-primary font-semibold' target='_blank' to="https://mehediscriptdev.vercel.app">Mehedi</Link> </small>
    </footer>
  );
};

export default Footer;
