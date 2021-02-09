window.onscroll = function() {reveal1(), reveal2(), reveal3(), reveal4(), reveal5(), reveal6(), reveal7(), reveal8()};

//if delete, change "mainPicture" class in CSS visability
function reveal1() {
  if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
    document.getElementById("code").className = "slideUp";
    document.getElementById("myImage").className = "slideUp";
    document.getElementById("buttonsImageCode").className = "slideUp";
    document.getElementById("buttonsImageCode2").className = "slideUp";
  }
}

function reveal2() {
    if (document.body.scrollTop > 450 || document.documentElement.scrollTop > 450) {
      document.getElementById("revealWorkExperience1").className = "slideUp";
      document.getElementById("revealWorkExperience2").className = "slideUp";
    }
  }

function reveal3() {
    if (document.body.scrollTop > 875 || document.documentElement.scrollTop > 875) {
      document.getElementById("hikersGuideReveal").className = "slideUp";
    }
  }

  function reveal4() {
    if (document.body.scrollTop > 1100 || document.documentElement.scrollTop > 1100) {
      document.getElementById("minesweeperReveal").className = "slideUp";
    }
  }
  function reveal5() {
    if (document.body.scrollTop > 1500 || document.documentElement.scrollTop > 1500) {
      document.getElementById("smallShellReveal").className = "slideUp";
    }
  }

  function reveal6() {
    if (document.body.scrollTop > 1850 || document.documentElement.scrollTop > 1850) {
      document.getElementById("ASMReveal").className = "slideUp";
    }
  }

  function reveal7() {
    if (document.body.scrollTop > 2250 || document.documentElement.scrollTop > 2250) {
      document.getElementById("mapReveal").className = "slideUp";
    }
  }

  function reveal8() {
    if (document.body.scrollTop > 2550 || document.documentElement.scrollTop > 2550) {
      document.getElementById("workoutReveal").className = "slideUp";
    }
  }