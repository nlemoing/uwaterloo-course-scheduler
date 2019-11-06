import re

offered_regex = re.compile('Offered: ([FWS](,[FWS])*)')

def check_ends(s, prefix='', suffix=''):
    """
    Helper function combining str.startswith and str.endswith
    Returns True if s.startswith(prefix) and s.endswith(suffix) are True
    Otherwise returns False
    """
    return s.startswith(prefix) and s.endswith(suffix)

### Tests
# assert check_ends('abc', prefix='a', suffix='c')
# assert check_ends('abc', prefix='a')
# assert check_ends('abc', suffix='c')
# assert check_ends('abc')
# assert not check_ends('abc', prefix='a', suffix='d')
# assert not check_ends('abc', prefix='d', suffix='c')
# assert not check_ends('abc', prefix='d', suffix='d')

def remove_ends(s, prefix='', suffix=''):
    """
    Helper function that mixes startswith, endswith, and strip.
    Takes a string and optional prefixes and suffixes.
    Returns s with prefix and suffix removed, if they exist
    """
    if not s.startswith(prefix):
        return remove_ends(s, suffix=suffix)
    if not s.endswith(suffix):
        return remove_ends(s, prefix=prefix)
    return s[len(prefix) : len(s) - len(suffix)]

### Tests
# assert remove_ends('abc', prefix='a', suffix='c') == 'b'
# assert remove_ends('abc', prefix='a') == 'bc'
# assert remove_ends('abc', suffix='c') == 'ab'
# assert remove_ends('abc') == 'abc'
# assert remove_ends('abc', prefix='a', suffix='d') == 'bc'
# assert remove_ends('abc', prefix='d', suffix='c') == 'ab'
# assert remove_ends('abc', prefix='d', suffix='d') == 'abc'