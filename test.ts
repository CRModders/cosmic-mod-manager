const srcObj = {
	name: "Abhinav",
	country: "India",
	countryCode: "IN",
	address: {
		zipCode: "824203",
		state: "Bihar",
		locality: {
			district: "Aurangabad",
			block: "Goh",
		},
	},
};

type SourceObject = typeof srcObj;

const anotherObj = {
	name: "Abhishek",
	country: "India",
	countryCode: null,
	address: {
		zipCode: null,
		state: "Bihar",
		locality: {
			district: "Gaya",
			block: null,
		},
	},
} satisfies SourceObject;

const updateObject = (srcObj: object, obj: object) => {
	const keys = Object.keys(srcObj);

	for (const key of keys) {
		if (obj[key] === null) {
			obj[key] = srcObj[key];
		} else if (typeof obj[key] === "object") {
			obj[key] = updateObject(srcObj[key], obj[key]);
		}
	}

	return obj;
};

console.log(anotherObj);
updateObject(srcObj, anotherObj);
console.log(anotherObj);
