import { Flag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rally-gray mt-12">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Flag className="w-6 h-6 text-rally-red" />
            <span className="text-xl font-bold text-white">
              Rally<span className="text-rally-red">Gallery</span>
            </span>
          </div>

          <div className="text-rally-light text-sm">
            <p>&copy; {new Date().getFullYear()} Rally Gallery. All rights reserved.</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-rally-light hover:text-rally-red transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="text-rally-light hover:text-rally-red transition-colors duration-200"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-rally-light hover:text-rally-red transition-colors duration-200"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;