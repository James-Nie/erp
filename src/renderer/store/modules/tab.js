// vuex

let state = {
  menuLevel: {
  	level1: '',
  	level2: '',
  	level3: ''
  }
}

const mutations = {
  updateMenuLevel (state, item) {
  	if (item.level === 1) {
  		state.menuLevel.level1 = item.name
  	} else if (item.level === 2) {
  		state.menuLevel.level2 = item.name
  	} else if (item.level === 3) {
  		state.menuLevel.level3 = item.name
  	}
    console.log(state.menuLevel)
  }
}

export default {
  state,
  mutations
}
