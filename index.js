'use strict';

//
// Most of the output placeholders which are supported by the git command line's
// --format flag. Currently not including the table separators.
//
var placeholders = 'H|h|T|t|P|p|an|aN|ae|aE|ad|aD|ar|at|ai|cn|cN|ce|cE|cd|cD|cr|ct|ci|d|e|s|f|b|B|N|GG|G\\?|GS|GK|gD|gd|gn|gN|ge|gE|gs|m|n|\\%|x00'
  , reformat = new RegExp('(%('+ placeholders +'))', 'g');

//
// Create a separator which we will use to container the placeholders.
//
var separator = '\ufffdgit-shizzle\ufffd';

/**
 * Parse the outputted lines to a JSON object.
 *
 * @param {String} line The outputted line.
 * @param {String} format Format that we used to output the line.
 * @returns {Object}
 * @api public
 */
function parser(line, format) {
  //
  // Start by cleaning up the output that could have been added by the `--graph`
  // command line flag. It prepends pointless `* ` in front of the returned
  // lines.
  //
  line = line.replace(/^\*\s+/, '');
  if (!~format.indexOf(separator)) format = reformatter(format);
  format = format.split(separator);

  var result = line.split(separator)
    , length = format.length
    , data = {}
    , i = 0;

  for (; i < length; i++) {
    if (format[i].charAt(0) !== '%') continue;

    switch (format[i]) {
      //
      // Hash based parsing>
      //
      case '%H': data.commithash = result[i]; break;
      case '%h': data.abbrevcommithash = result[i]; break;
      case '%T': data.treehash = result[i]; break;
      case '%t': data.abbrevtreehash = result[i]; break;
      case '%P': data.parenthash = result[i]; break;
      case '%p': data.abbrevparenthash = result[i]; break;

      //
      // Author information.
      //
      case '%an': data.authored = data.authored || {}; data.authored.name = result[i]; break;
      case '%aN': data.authored = data.authored || {}; data.authored.name_map = result[i]; break;
      case '%ae': data.authored = data.authored || {}; data.authored.email = result[i]; break;
      case '%aE': data.authored = data.authored || {}; data.authored.email_map = result[i]; break;
      case '%ad': data.authored = data.authored || {}; data.authored.date = result[i]; break;
      case '%aD': data.authored = data.authored || {}; data.authored.rfc = result[i]; break;
      case '%ar': data.authored = data.authored || {}; data.authored.ago = result[i]; break;
      case '%at': data.authored = data.authored || {}; data.authored.unix = +result[i]; break;
      case '%ai': data.authored = data.authored || {}; data.authored.iso = result[i]; break;

      //
      // Committer information.
      //
      case '%cn': data.commited = data.commited || {}; data.commited.name = result[i]; break;
      case '%cN': data.commited = data.commited || {}; data.commited.name_map = result[i]; break;
      case '%ce': data.commited = data.commited || {}; data.commited.email = result[i]; break;
      case '%cE': data.commited = data.commited || {}; data.commited.email_map = result[i]; break;
      case '%cd': data.commited = data.commited || {}; data.commited.date = result[i]; break;
      case '%cD': data.commited = data.commited || {}; data.commited.rfc = result[i]; break;
      case '%cr': data.commited = data.commited || {}; data.commited.ago = result[i]; break;
      case '%ct': data.commited = data.commited || {}; data.commited.unix = +result[i]; break;
      case '%ci': data.commited = data.commited || {}; data.commited.iso = result[i]; break;

      //
      // Actual commit information.
      //
      case '%d': data.ref = result[i].trim(); break;
      case '%e': data.encoding = result[i]; break;
      case '%s': data.subject = result[i]; break;
      case '%f': data.subject_name = result[i]; break;
      case '%b': data.body = result[i]; break;
      case '%B': data.raw_body = result[i]; break;
      case '%N': data.notes = result[i]; break;

      //
      // Commit verification.
      //
      case '%GG': data.verification = result[i]; break;
      case '%G?': data.signature = result[i]; break;
      case '%GS': data.signer = data.signer || {}; data.signer.name = result[i]; break;
      case '%GK': data.signer = data.signer || {}; data.signer.key = result[i]; break;

      //
      // Reflog information.
      //
      case '%gD': data.reflog = data.reflog || {}; data.reflog.selector = result[i]; break;
      case '%gd': data.reflog = data.reflog || {}; data.reflog.abbrevselector = result[i]; break;
      case '%gn': data.reflog = data.reflog || {}; data.reflog.name = result[i]; break;
      case '%gN': data.reflog = data.reflog || {}; data.reflog.name_map = result[i]; break;
      case '%ge': data.reflog = data.reflog || {}; data.reflog.email = result[i]; break;
      case '%gE': data.reflog = data.reflog || {}; data.reflog.email_map = result[i]; break;
      case '%gs': data.reflog = data.reflog || {}; data.reflog.subject = result[i]; break;
    }
  }

  return data;
}

/**
 * Reformat the format pattern so we can actually parse it.
 *
 * @TODO specifically check for the --format or --pretty="format:" flags>
 * @param {String} args The arguments which could contain a format
 * @returns {String} reformatted string.
 * @api public
 */
function reformatter(args) {
  return args.replace(reformat, separator +'$1'+ separator);
}

/**
 * Extract the formats from the given argument string.
 *
 * @param {String} args The arguments which could contain a format
 * @returns {String} The format/placeholders
 * @api public
 */
function extract(arg) {
  var format = /--pretty=format\:(\'|\")(.+)\1/g.exec(arg);

  return format ? format[2] : '';
}

//
// Expose the module and various of helper methods.
//
parser.reformat = reformatter;
parser.separator = separator;
parser.extract = extract;
module.exports = parser;
