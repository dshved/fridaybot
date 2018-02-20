//const vm = require('vm');
var util = require('util'); 
const {VM} = require('vm2');



function getCodeResult(text, callback) {
  try{
  	//  без vm2 
 	// const sandbox = {};
	// vm.createContext(sandbox);
	// vm.runInThisContext(text,sandbox)(require);
	//   callback(util.inspect(sandbox), {});
	const vm = new VM({
	    console: 'inherit',
	    sandbox: {},
	    require: {
	        external: true,
	        root: "./",
	        mock: {
	            fs: {
	                readFileSync() { return 'Nice try!'; }
	            }
	        }
	    }
	});
	callback(vm.run(text),{});

	}
  	catch (e) {
	  callback(e.message, {});
	};
}  

module.exports = getCodeResult;
