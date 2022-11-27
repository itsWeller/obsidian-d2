import { tmpdir } from "os";
import { nanoid } from "nanoid";

// abstract nanoid in case we decide to go native for random chars
export const randomChars = (count: number) => nanoid(count);

/**
 * Generate random name and path for temporary file.
 * @param [opts] - options for temporary filename generation
 * @param {string} [opts.postfix] - filename postfix; include "." for extensions
 * @param {string} [opts.prefix] - filename prefix; separator must be added manually if needed
 * @param {number} [opts.length] - desired length of filename, pre/postfix included; minimum of 8 characters
 * @returns {string} temporary filename
 */
export const tmpName = ({
	prefix = "tmp-",
	postfix = "",
	length = 16,
} = {}) => {
	return `${tmpdir()}/${prefix}${process.pid}-${randomChars(
		Math.max(
			length -
				(prefix.length +
					process.pid.toString().length +
					postfix.length),
			8
		)
	)}${postfix}`;
};
