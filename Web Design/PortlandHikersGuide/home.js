

/* JS for image borders 
adapted from: https://codepen.io/electerious/pen/GzrmwB */
document.querySelector('.homeButtons').onmousemove = (position) => {
	//x axis
	const x = position.pageX - position.target.offsetLeft
	//y axis
	const y = position.pageY - position.target.offsetTop
	//set the new properties for the x and y axis
	position.target.style.setProperty('--x', `${ x }px`)
	position.target.style.setProperty('--y', `${ y }px`)
}





