import React from 'react';
import PropertyMap from './PropertyMap';
import './PropertyList.css';

const PropertyList = ({ properties, type, loadAllProperty }) => {
	return (
		<div className='list'>
			<h2>{type}</h2>
			<PropertyMap
				type={type}
				properties={properties}
			/>
			<span onClick={loadAllProperty}>
				Show All >
			</span>
		</div>
	);
};

export default PropertyList;
