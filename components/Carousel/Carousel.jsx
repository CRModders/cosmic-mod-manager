import React from "react";
import styles from "./styles.module.css";

/**
 *
 * @param {object} props
 * @param {string} props.section_title
 * @param {object} props.items
 * @param {string} props.items.logo
 * @param {string} props.items.title
 * @param {string} props.items.description
 * @param {string} props.items.author
 */

function Carousel({ section_title, items }) {
	return (
		<div className={styles.carousel}>
			<div className={styles.carousel_wrapper}>
				<h2 className={styles.carousel_title}>{section_title}</h2>
			</div>
		</div>
	);
}

export default Carousel;
