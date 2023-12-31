import { is } from 'superstruct';

import {
  HttpSnapIdStruct,
  isCaipChainId,
  LocalSnapIdStruct,
  NpmSnapIdStruct,
  validateSnapId,
} from './snaps';
import { SnapIdPrefixes, uri } from './types';

describe('validateSnapId', () => {
  it.each([undefined, {}, null, true, 2])(
    'throws for non-strings (#%#)',
    (value) => {
      expect(() => validateSnapId(value)).toThrow(
        'Invalid snap id. Not a string.',
      );
    },
  );

  it('throws for invalid snap id', () => {
    expect(() => validateSnapId('foo:bar')).toThrow(
      'Invalid snap id. Unknown prefix.',
    );
  });

  it.each(Object.values(SnapIdPrefixes))(
    'returns with "%s" prefix',
    (prefix) => {
      expect(() => validateSnapId(`${prefix}bar`)).not.toThrow();
    },
  );
});

describe('isCaipChainId', () => {
  it.each([undefined, {}, null, true, 2])(
    'returns false for non-strings (#%#)',
    (value) => {
      expect(isCaipChainId(value)).toBe(false);
    },
  );

  it.each([
    'eip155:1',
    'cosmos:iov-mainnet',
    'bip122:000000000019d6689c085ae165831e93',
    'cosmos:cosmoshub-2',
  ])('returns true for valid IDs (#%#)', (value) => {
    expect(isCaipChainId(value)).toBe(true);
  });
});

describe('LocalSnapIdStruct', () => {
  it.each([
    'local:http://localhost',
    'local:http://localhost/',
    'local:http://localhost/',
    'local:https://localhost',
    'local:https://localhost/',
    'local:http://127.0.0.1/foo/bar',
    'local:http://127.0.0.1:8080/',
    'local:http://localhost:8080/',
    'local:http://[::1]:8080/',
    'local:http://[::1]',
    'local:https://foo@localhost/',
    'local:http://foo:bar@127.0.01/',
  ])('validates "%s" as proper local ID', (value) => {
    expect(is(value, LocalSnapIdStruct)).toBe(true);
  });

  it.each([
    0,
    1,
    '',
    'foo',
    false,
    true,
    {},
    [],
    uri,
    URL,
    new URL('http://127.0.01'),
    new URL('local:127.0.0.1'),
    'http://localhost',
    '127.0.0.1',
    'local:127.0.0.1',
    'local:127.0.0.1/',
    'local:foo://127.0.0.1/',
    'local:http://github.com',
    'local:http://localhost/foo?bar=true',
    'local:http://localhost/foo#bar',
    'local:http://localhost/42?foo=true#bar',
    'local',
    'local:',
    'local:http://',
  ])('invalidates an improper local ID (#%#)', (value) => {
    expect(is(value, LocalSnapIdStruct)).toBe(false);
  });
});

describe('NpmSnapIdStruct', () => {
  it.each([
    'npm:foo',
    'npm:foo-bar',
    'npm://registry.com/foo',
    'npm:@foo/bar',
    'npm://registry.com/@foo/bar',
    'npm://user@registry.com/bar',
    'npm://user:pass@registry.com/bar',
    'npm://[::1]/bar',
    'npm://[::1]:8080/bar',
  ])('validates "%s" as proper NPM ID', (value) => {
    expect(is(value, NpmSnapIdStruct)).toBe(true);
  });

  it.each([
    0,
    1,
    false,
    true,
    {},
    [],
    uri,
    URL,
    '',
    'npm:',
    'npm',
    'npm:http://registry.com/foo',
    'npm://registry.com',
    'npm://registry.com/',
    'npm:foo#bar',
    'npm:foo?bar=true',
    'npm:snap?foo=true#bar',
    'npm://registry.com/snap?foo=true',
    'npm://registry.com/snap#foo',
    'npm://registry.com/snap?foo=true#bar',
    'local:foo',
    'local://registry.com/foo',
    'foo:bar',
    'npm:ASDASDasd',
    'npm:.',
    'npm:excited!',
    // 220 characters, limit is 214
    'npm:abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij',
    new URL('npm:foo'),
    new URL('npm://registry.com/foo'),
  ])('invalidates an improper NPM ID (#%#)', (value) => {
    expect(is(value, NpmSnapIdStruct)).toBe(false);
  });
});

describe('HttpSnapIdStruct', () => {
  it.each([
    'http://[::1]',
    'http://[::1]:8080',
    'http://localhost',
    'http://localhost/',
    'https://localhost',
    'https://localhost/',
    'http://github.com',
    'http://github.com/foo',
    'http://gihtub.com/@foo/bar',
    'https://github.com/@foo/bar',
  ])('validates "%s" as proper http ID', (value) => {
    expect(is(value, HttpSnapIdStruct)).toBe(true);
  });

  it.each([
    0,
    1,
    false,
    true,
    {},
    [],
    uri,
    URL,
    new URL('http://github.com'),
    '',
    'http',
    'http:',
    'http://',
    'foo://localhost',
    'npm://localhost',
    'npm:localhost',
    'local:http://localhost',
    'http://github.com/?foo=true',
    'http://github.com/#foo',
    'http://github.com/?foo=true#bar',
    'http://github.com/snap?foo=true#bar',
  ])('invalidates an improper http ID (#%#)', (value) => {
    expect(is(value, HttpSnapIdStruct)).toBe(false);
  });
});
