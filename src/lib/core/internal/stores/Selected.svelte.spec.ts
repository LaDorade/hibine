import { beforeEach, describe, expect, it } from 'vitest';
import { SelectedStore } from './Selected.svelte';

describe('SelectedStore', () => {
  let store: SelectedStore;

  beforeEach(() => {
    store = new SelectedStore();
  });

  describe('select', () => {
    it('should add a path to the selected set', () => {
      store.select('path/to/file.txt');
      expect(store.isSelected('path/to/file.txt')).toBe(true);
    });

    it('should add multiple paths to the selected set', () => {
      store.select('path/to/file1.txt');
      store.select('path/to/file2.txt');
      store.select('path/to/file3.txt');
			
      expect(store.isSelected('path/to/file1.txt')).toBe(true);
      expect(store.isSelected('path/to/file2.txt')).toBe(true);
      expect(store.isSelected('path/to/file3.txt')).toBe(true);
    });

    it('should handle selecting the same path multiple times', () => {
      store.select('path/to/file.txt');
      store.select('path/to/file.txt');
			
      const all = store.getAll();
      expect(all).toHaveLength(1);
      expect(all[0]).toBe('path/to/file.txt');
    });

    it('should handle empty path', () => {
      store.select('');
      expect(store.isSelected('')).toBe(true);
    });

    it('should handle paths with special characters', () => {
      const specialPaths = [
        'path/with spaces/file.txt',
        'path/with-dashes/file.txt',
        'path/with_underscores/file.txt',
        'path/with.dots/file.txt',
        'path/with@symbols/file.txt'
      ];

      specialPaths.forEach(path => {
        store.select(path);
        expect(store.isSelected(path)).toBe(true);
      });
    });
  });

  describe('deselect', () => {
    it('should remove a path from the selected set', () => {
      store.select('path/to/file.txt');
      store.deselect('path/to/file.txt');
			
      expect(store.isSelected('path/to/file.txt')).toBe(false);
    });

    it('should handle deselecting a non-existent path', () => {
      store.deselect('non/existent/path.txt');
      expect(store.isSelected('non/existent/path.txt')).toBe(false);
    });

    it('should only remove the specified path', () => {
      store.select('path/to/file1.txt');
      store.select('path/to/file2.txt');
      store.deselect('path/to/file1.txt');
			
      expect(store.isSelected('path/to/file1.txt')).toBe(false);
      expect(store.isSelected('path/to/file2.txt')).toBe(true);
    });

    it('should handle multiple deselections', () => {
      store.select('path/to/file1.txt');
      store.select('path/to/file2.txt');
      store.select('path/to/file3.txt');
			
      store.deselect('path/to/file1.txt');
      store.deselect('path/to/file2.txt');
      store.deselect('path/to/file3.txt');
			
      expect(store.getAll()).toHaveLength(0);
    });
  });

  describe('toggle', () => {
    it('should add a path if not selected', () => {
      store.toggle('path/to/file.txt');
      expect(store.isSelected('path/to/file.txt')).toBe(true);
    });

    it('should remove a path if already selected', () => {
      store.select('path/to/file.txt');
      store.toggle('path/to/file.txt');
			
      expect(store.isSelected('path/to/file.txt')).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      store.toggle('path/to/file.txt');
      expect(store.isSelected('path/to/file.txt')).toBe(true);
			
      store.toggle('path/to/file.txt');
      expect(store.isSelected('path/to/file.txt')).toBe(false);
			
      store.toggle('path/to/file.txt');
      expect(store.isSelected('path/to/file.txt')).toBe(true);
    });

    it('should toggle different paths independently', () => {
      store.toggle('path/to/file1.txt');
      store.toggle('path/to/file2.txt');
      store.toggle('path/to/file1.txt');
			
      expect(store.isSelected('path/to/file1.txt')).toBe(false);
      expect(store.isSelected('path/to/file2.txt')).toBe(true);
    });
  });

  describe('isSelected', () => {
    it('should return true for selected paths', () => {
      store.select('path/to/file.txt');
      expect(store.isSelected('path/to/file.txt')).toBe(true);
    });

    it('should return false for non-selected paths', () => {
      expect(store.isSelected('path/to/file.txt')).toBe(false);
    });

    it('should be case-sensitive', () => {
      store.select('path/to/File.txt');
      expect(store.isSelected('path/to/File.txt')).toBe(true);
      expect(store.isSelected('path/to/file.txt')).toBe(false);
    });

    it('should distinguish between similar paths', () => {
      store.select('path/to/file.txt');
      expect(store.isSelected('path/to/file.txt')).toBe(true);
      expect(store.isSelected('path/to/file')).toBe(false);
      expect(store.isSelected('path/to/file.txt.bak')).toBe(false);
    });
  });


  describe('rangeTo', () => {
    it('should exist as a method', () => {
      expect(typeof store.rangeTo).toBe('function');
    });

    it('should not throw when called', () => {
      expect(() => store.rangeTo('path/to/file.txt')).not.toThrow();
    });

    // Note: This method is currently not implemented
    // Tests should be added when the implementation is completed
  });

  describe('clear', () => {
    it('should remove all selected paths', () => {
      store.select('path/to/file1.txt');
      store.select('path/to/file2.txt');
      store.select('path/to/file3.txt');
			
      store.clear();
			
      expect(store.getAll()).toHaveLength(0);
    });

    it('should work on an empty store', () => {
      expect(() => store.clear()).not.toThrow();
      expect(store.getAll()).toHaveLength(0);
    });

    it('should allow selecting paths after clearing', () => {
      store.select('path/to/file1.txt');
      store.clear();
      store.select('path/to/file2.txt');
			
      expect(store.isSelected('path/to/file1.txt')).toBe(false);
      expect(store.isSelected('path/to/file2.txt')).toBe(true);
    });

    it('should clear multiple times without issues', () => {
      store.select('path/to/file.txt');
      store.clear();
      store.clear();
			
      expect(store.getAll()).toHaveLength(0);
    });
  });

  describe('getAll', () => {
    it('should return an empty array for a new store', () => {
      const all = store.getAll();
      expect(all).toEqual([]);
    });

    it('should return all selected paths', () => {
      store.select('path/to/file1.txt');
      store.select('path/to/file2.txt');
      store.select('path/to/file3.txt');
			
      const all = store.getAll();
      expect(all).toHaveLength(3);
      expect(all).toContain('path/to/file1.txt');
      expect(all).toContain('path/to/file2.txt');
      expect(all).toContain('path/to/file3.txt');
    });

    it('should return a new array instance', () => {
      store.select('path/to/file.txt');
      const all1 = store.getAll();
      const all2 = store.getAll();
			
      expect(all1).not.toBe(all2);
      expect(all1).toEqual(all2);
    });

    it('should not affect the store when modifying the returned array', () => {
      store.select('path/to/file1.txt');
      store.select('path/to/file2.txt');
			
      const all = store.getAll();
      all.push('path/to/file3.txt');
      all.pop();
			
      expect(store.getAll()).toHaveLength(2);
    });

    it('should reflect changes made to the store', () => {
      store.select('path/to/file1.txt');
      expect(store.getAll()).toHaveLength(1);
			
      store.select('path/to/file2.txt');
      expect(store.getAll()).toHaveLength(2);
			
      store.deselect('path/to/file1.txt');
      expect(store.getAll()).toHaveLength(1);
			
      store.clear();
      expect(store.getAll()).toHaveLength(0);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complex selection workflow', () => {
      // Select multiple files
      store.select('folder1/file1.txt');
      store.select('folder1/file2.txt');
      store.select('folder2/file3.txt');
			
      expect(store.getAll()).toHaveLength(3);
			
      // Toggle some selections
      store.toggle('folder1/file1.txt');
      expect(store.isSelected('folder1/file1.txt')).toBe(false);

      // Clear all
      store.clear();
      expect(store.getAll()).toHaveLength(0);
    });

    it('should handle mixed file and folder selections', () => {
      store.select('folder/');
      store.select('file.txt');
      store.select('other/nested/file.js');
			
      expect(store.getAll()).toHaveLength(3);
    });

    it('should maintain state consistency across operations', () => {
      const paths = [
        'a/b/c.txt',
        'd/e/f.txt',
        'g/h/i.txt'
      ];
			
      // Select all
      paths.forEach(path => store.select(path));
      expect(store.getAll()).toHaveLength(3);
			
      // Deselect middle one
      store.deselect(paths[1]);
      expect(store.getAll()).toHaveLength(2);
      expect(store.isSelected(paths[0])).toBe(true);
      expect(store.isSelected(paths[1])).toBe(false);
      expect(store.isSelected(paths[2])).toBe(true);
			
      // Toggle first one off
      store.toggle(paths[0]);
      expect(store.getAll()).toHaveLength(1);
			
      // Toggle second one back on
      store.toggle(paths[1]);
      expect(store.getAll()).toHaveLength(2);
			
      // Clear
      store.clear();
      expect(store.getAll()).toHaveLength(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long paths', () => {
      const longPath = 'a/'.repeat(100) + 'file.txt';
      store.select(longPath);
      expect(store.isSelected(longPath)).toBe(true);
    });

    it('should handle paths with unicode characters', () => {
      const unicodePaths = [
        'folder/文件.txt',
        'dossier/fichier-français.txt',
        'папка/файл.txt',
        'フォルダ/ファイル.txt'
      ];
			
      unicodePaths.forEach(path => {
        store.select(path);
        expect(store.isSelected(path)).toBe(true);
      });
    });

    it('should handle paths with trailing slashes', () => {
      store.select('folder/');
      expect(store.isSelected('folder/')).toBe(true);
      expect(store.isSelected('folder')).toBe(false);
    });

    it('should handle relative paths', () => {
      store.select('../parent/file.txt');
      store.select('./current/file.txt');
			
      expect(store.isSelected('../parent/file.txt')).toBe(true);
      expect(store.isSelected('./current/file.txt')).toBe(true);
    });

    it('should handle Windows-style paths', () => {
      const windowsPath = 'C:\\Users\\Document\\file.txt';
      store.select(windowsPath);
      expect(store.isSelected(windowsPath)).toBe(true);
    });

    it('should handle simultaneous operations', () => {
      store.select('path1');
      store.select('path2');
      store.toggle('path1');
      store.deselect('path2');
      store.select('path3');
			
      expect(store.isSelected('path1')).toBe(false);
      expect(store.isSelected('path2')).toBe(false);
      expect(store.isSelected('path3')).toBe(true);
    });
  });
});
