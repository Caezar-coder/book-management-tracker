import React, { useState } from 'react'
import { BiSolidCategory } from "react-icons/bi";
import { FaLocationArrow } from "react-icons/fa";
import { GiBookmarklet } from "react-icons/gi";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css'

const navItems = [
  {
    title: "Categories",
    icon: <BiSolidCategory className='icons' />,
    href: "/categories",
    submenu: [
      { title: "Drama", href: "/books" },
      { title: "Comedy", href: "/electronics" },
      { title: "Fiction", href: "/furniture" },
    ],
  },
  {
    title: "Locations",
    icon: <FaLocationArrow className='icons' />,
    href: "/locations",
  },
  {
    title: "Bookmarks",
    icon: <GiBookmarklet className='icons' />,
    href: "/bookmarks",
  },
];

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openAccordions, setOpenAccordions] = useState([]);

    const handleAccordionChange = (value) => {
        setOpenAccordions((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const handleLogout = () => {
        navigate('/');
    }

    return (
        <div className='navBarBody'>
            <div className="top">
                {navItems.map((item, index) => (
                    <div key={index} className="nav-item">
                        {item.submenu ? (
                            <>
                                <button
                                    onClick={() => handleAccordionChange(item.title)}
                                    className={`nav-button ${openAccordions.includes(item.title) ? 'active' : ''}`}
                                >
                                    {item.icon}
                                    <span className="nav-text">{item.title}</span>
                                </button>
                                {openAccordions.includes(item.title) && (
                                    <div className="submenu">
                                        {item.submenu.map((subItem, subIndex) => (
                                            <button
                                                key={subIndex}
                                                className={`submenu-item ${location.pathname === subItem.href ? 'active' : ''}`}
                                                onClick={() => navigate(subItem.href)}
                                            >
                                                <span>{subItem.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <button
                                className={`nav-button ${location.pathname === item.href ? 'active' : ''}`}
                                onClick={() => navigate(item.href)}
                            >
                                {item.icon}
                                <span className="nav-text">{item.title}</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="bottom">
                <button className="nav-button" onClick={handleLogout}>
                    <TbLogout2 className='icons' />
                    <span className="nav-text">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Navbar
