const { spawn } = require( "child_process" );
const ratioMap = (()=>{
  return Object.assign({},...(
    [].concat(
      [
        "la,", "te,", "ti,",
        "do", "ra", "re", "me", "mi", "fa", "se", "sol", "le", "la", "te", "ti",
        "do'","ra'","re'","me'","mi'","fa'","se'","sol'","le'","la'","te'","ti'",
      ].map( (e,n)=>({ [e]: Math.round( 440 * Math.pow(2,n/12) ) }) ),
      [
        "la,", "li,", "ti,",
        "do", "di", "re", "ri", "mi", "fa", "fi", "sol", "si", "la", "li", "ti",
        "do'","di'","re'","ri'","mi'","fa'","fi'","sol'","si'","la'","li'","ti'",
      ].map( (e,n)=>({ [e]: Math.round( 440 * Math.pow(2,n/12) ) }) ),
    )
  ));
})();

console.log( ratioMap );

function beep(nargs) {
  if ( nargs === undefined ) {
    nargs = {
      note : 'la',
    };
  }
  if ( typeof nargs === 'string' ) {
    nargs = {
      note : nargs,
    };
  }

  let {
    length = "0.125",
    freq   = "880",
    note   = null,
  } = nargs;

  if ( typeof note === 'string' ) {
    freq = ratioMap[ note ];
  }
  return new Promise((resolve,reject)=>{
    const ls = spawn("play", [
      "-q", "-n", "synth",
      length,
      "square",
      freq,
      "vol",
      "0.2",
      "pad",
      "0",
      length, // "1",
      "reverb",
      "10",
      "0",
      "100",
      "100",
      "4",
    ]);

    ls.stdout.on("data", data => {
      // console.log(`stdout: ${data}`);
    });

    ls.stderr.on("data", data => {
      //console.log(`stderr: ${data}`);
    });

    ls.on('error', (error) => {
      // console.log(`error: ${error.message}`);
    });

    ls.on("close", code => {
      resolve();
    });
  });
}

module.exports.beep = beep;

// (async () =>{
//   await beep({note:"do"});
//   await beep({note:"re"});
//   await beep({note:"mi"});
//   await beep('do');
//   await beep("do'");
// })();

