import { getMatchingFilePaths } from '../../src/services';
import { Comment, Change, ChangeType } from '../../src/models';

test('* matches everything', () => {
  const comment: Comment = {
    pathFilter: ['*'],
    markdown: 'Woohoo!',
    blocking: false
  };

  const changes: Change[] = [
    {
      file: 'app/models/foo.rb',
      changeType: ChangeType.edit,
      patch: ''
    }
  ];

  const result = getMatchingFilePaths(comment, changes);

  expect(result).toEqual(changes.map(c => c.file));
});

test('match recursively', () => {
  const comment: Comment = {
    pathFilter: ['app/**'],
    markdown: 'Woohoo!',
    blocking: false
  };

  const changes: Change[] = [
    {
      file: 'app/models/foo.rb',
      changeType: ChangeType.edit,
      patch: ''
    }
  ];

  const result = getMatchingFilePaths(comment, changes);

  expect(result).toEqual(changes.map(c => c.file));
});

test('ignore case', () => {
  const comment: Comment = {
    pathFilter: ['app/**'],
    markdown: 'Woohoo!',
    blocking: false
  };

  const changes: Change[] = [
    {
      file: 'APP/MODELS/FOO.rb',
      changeType: ChangeType.edit,
      patch: ''
    }
  ];

  const result = getMatchingFilePaths(comment, changes);

  expect(result).toEqual(changes.map(c => c.file));
});

test('remove exclusion patterns', () => {
  const comment: Comment = {
    pathFilter: ['app/**', '!app/models/*.h'],
    markdown: 'Everything except headers',
    blocking: false
  };

  const changes: Change[] = [
    {
      file: 'app/models/main.h',
      changeType: ChangeType.edit,
      patch: ''
    }
  ];

  const result = getMatchingFilePaths(comment, changes);

  expect(result).toEqual([]);
});

test('match new files only', () => {
  const comment: Comment = {
    pathFilter: ['+app/**'],
    markdown: 'Only new files',
    blocking: false
  };

  const changes: Change[] = [
    {
      file: 'app/models/old.rb',
      changeType: ChangeType.edit,
      patch: ''
    },
    {
      file: 'app/models/new.rb',
      changeType: ChangeType.add,
      patch: ''
    }
  ];

  const result = getMatchingFilePaths(comment, changes);

  expect(result).toEqual(['app/models/new.rb']);
});

test('match deleted files only', () => {
  const comment: Comment = {
    pathFilter: ['-app/**'],
    markdown: 'Only deleted files',
    blocking: false
  };

  const changes: Change[] = [
    {
      file: 'app/models/old.rb',
      changeType: ChangeType.edit,
      patch: ''
    },
    {
      file: 'app/models/deleted.rb',
      changeType: ChangeType.delete,
      patch: ''
    }
  ];

  const result = getMatchingFilePaths(comment, changes);

  expect(result).toEqual(['app/models/deleted.rb']);
});

test('match edited files only', () => {
  const comment: Comment = {
    pathFilter: ['~app/**'],
    markdown: 'Only deleted files',
    blocking: false
  };

  const changes: Change[] = [
    {
      file: 'app/models/old.rb',
      changeType: ChangeType.edit,
      patch: ''
    },
    {
      file: 'app/models/deleted.rb',
      changeType: ChangeType.delete,
      patch: ''
    }
  ];

  const result = getMatchingFilePaths(comment, changes);

  expect(result).toEqual(['app/models/old.rb']);
});

test('disallow multiple modifiers', () => {
  const comment: Comment = {
    pathFilter: ['!~app/**'],
    markdown: 'Not edited files',
    blocking: false
  };

  const changes: Change[] = [
    {
      file: 'app/models/old.rb',
      changeType: ChangeType.edit,
      patch: ''
    }
  ];

  expect(() => getMatchingFilePaths(comment, changes)).toThrow(
    'Multiple path modifiers are not supported'
  );
});
