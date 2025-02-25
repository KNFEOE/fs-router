export type Context = {
	isMicroApp: boolean;
	isRunInShell: boolean;
	namespace: string;
}

export type LoaderParams = {
	context?: Context;
	params: Record<string, any>;
	request: Request;
}

export let namespace = 'admin_injector'

export const loader = function layoutLoader(args: LoaderParams) {
	if (args.context) {
		namespace = args.context.namespace
	}

	return {
		code: 0,
		data: {
			name: `「${namespace || '@apps/admin'}」 from layout.data`,
		},
	};
};
