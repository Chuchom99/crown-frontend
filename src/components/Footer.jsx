import React from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import Logo from "../assets/Logot (1).png";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2">
              {/* <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white shadow-soft">
                <Sun size={20} />
              </span> */}
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={Logo}
                  alt="Crown Solar Logo"
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <div>
                <p className="text-sm text-slate-600">
                  Powering homes and businesses with reliable solar solutions.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* ABOUT */}
          <div>
            <h4 className="font-semibold">About us</h4>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              We provide trusted solar panels, inverters, batteries, and
              complete energy solutions tailored for homes, offices, and
              businesses across Nigeria.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold">Quick links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 hover:text-brand-orange"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-slate-600 hover:text-brand-orange"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/quote"
                  className="text-slate-600 hover:text-brand-orange"
                >
                  Get a quote
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 hover:text-brand-orange"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Phone size={14} />
                <span>+234 801 234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} />
                <span>info@solardealer.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div>
            © {new Date().getFullYear()} SolarDealer. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-brand-orange">
              Privacy policy
            </Link>
            <Link to="/terms" className="hover:text-brand-orange">
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
