import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../UserContext";
import OutsideAlerter from "./OutsideAlerter";
import "./NavBar.css";

const ProfileMenu = ({ toggleMenu, userID, logOut }) => {
	const menuList = [
		{
			role: "Guest",
			label: "Profile",
			link: `/profile/${userID}`
		},
		{
			role: "Guest",
			label: "Log Out",
			link: "/logout"
		}
	];

	const handleLogOut = () => {
		logOut();
	};

	const menuMarkup = menuList.map((link, i) => {
		return link.label === "Log Out" ? (
			<li key={i}>
				<div className='profile-item'>
					<div onClick={handleLogOut}>{link.label}</div>
				</div>
			</li>
		) : (
				<li key={i}>
					<div className='profile-item'>
						<Link to={link.link}>
							<div>{link.label}</div>
						</Link>
					</div>
				</li>
			);
	});
	return (
		<OutsideAlerter toggleMenu={toggleMenu}>
			<div className='profile-container'>
				<div className='_1yvjit1'>
					<div className='profile-menu'>
						<ul>{menuMarkup}</ul>
					</div>
				</div>
			</div>
		</OutsideAlerter>
	);
};

export default ProfileMenu;
