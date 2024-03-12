import React from "react";
import styles from "./styles.module.css";
import { Mod_Item } from "@/types";

type CarouselProps = {
	section_title: string;
	items: Mod_Item[];
};

function Carousel({ section_title, items }: CarouselProps) {
	return (
		<div className={styles.carousel}>
			<div className={styles.carousel_wrapper}>
				<h2 className={styles.carousel_title}>{section_title}</h2>
			</div>
		</div>
	);
}

export default Carousel;
