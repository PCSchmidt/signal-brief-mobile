const NativeFormData = require('react-native/Libraries/Network/FormData').default;

type GlobalWithFormData = typeof globalThis & {
	FormData?: unknown;
	setImmediate?: (callback: (...args: any[]) => void, ...args: any[]) => number;
	clearImmediate?: (handle: number) => void;
};

declare const global: GlobalWithFormData;

const globalScope = typeof global !== "undefined" ? global : typeof globalThis !== "undefined" ? globalThis : self;
let nextImmediateHandle = 1;
const cancelledHandles = new Set<number>();

if (typeof globalScope.setImmediate === 'undefined') {
	globalScope.setImmediate = (callback: (...args: any[]) => void, ...args: any[]) => {
		const handle = nextImmediateHandle++;
		Promise.resolve().then(() => {
			if (cancelledHandles.has(handle)) {
				cancelledHandles.delete(handle);
				return;
			}
			callback(...args);
		});
		return handle;
	};
}

if (typeof globalScope.clearImmediate === 'undefined') {
	globalScope.clearImmediate = (handle) => {
		cancelledHandles.add(handle);
	};
}

if (typeof globalScope.FormData === 'undefined') {
	globalScope.FormData = NativeFormData;
}

if (typeof globalThis.setImmediate === 'undefined') {
	globalThis.setImmediate = globalScope.setImmediate;
}

if (typeof globalThis.clearImmediate === 'undefined') {
	globalThis.clearImmediate = globalScope.clearImmediate;
}

if (typeof globalThis.FormData === 'undefined') {
	globalThis.FormData = globalScope.FormData;
}

const publishGlobalBinding = (name: 'setImmediate' | 'clearImmediate' | 'FormData') => {
	if (typeof globalThis[name] === 'undefined') {
		return;
	}
	const runGlobalEval = globalThis.eval as ((code: string) => void) | undefined;
	runGlobalEval?.(`if (typeof ${name} === 'undefined') { var ${name} = globalThis.${name}; }`);
};

publishGlobalBinding('setImmediate');
publishGlobalBinding('clearImmediate');
publishGlobalBinding('FormData');