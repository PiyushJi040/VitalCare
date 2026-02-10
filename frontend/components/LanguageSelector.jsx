import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ className = "" }) => {
	const { i18n } = useTranslation();
	const [activeLang, setActiveLang] = useState(i18n.language || "EN");

	const handleLanguageChange = (lang) => {
		setActiveLang(lang);
		i18n.changeLanguage(lang);
	};

	return (
		<div className={`flex items-center bg-gray-700 border border-gray-600 rounded-full p-0.5 ${className}`}>
			{["EN", "HI", "PA"].map((lang) => (
				<button
					key={lang}
					onClick={() => handleLanguageChange(lang)}
					className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
						activeLang === lang
							? "bg-blue-600 text-white shadow-sm"
							: "text-gray-300 hover:text-white hover:bg-gray-600"
					}`}
				>
					{lang}
				</button>
			))}
		</div>
	);
};

export default LanguageSelector;