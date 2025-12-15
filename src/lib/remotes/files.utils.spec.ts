import { describe, expect, it, vi } from 'vitest';
import { getFileExtension, getRelativePathFromTape, getValidPathInTape, isValidPath, sanitizeFileName, sanitizeFilePath } from './files.utils';

describe('files.utils', () => {
  describe('sanitizeFileName', () => {
    it('should replace invalid characters with underscores and trim whitespace', () => {
      const input = ' invali<>d:fi|le*name?.txt ';
      const expected = 'invali__d_fi_le_name_.txt';
      expect(sanitizeFileName(input)).toBe(expected);
    });

    it('should not modify valid file names', () => {
      const input = 'valid-file_name.txt';
      const expected = 'valid-file_name.txt';
      expect(sanitizeFileName(input)).toBe(expected);
    });

    it('should allow spaces and dots', () => {
      const input = ' my file.name ';
      const expected = 'my file.name';
      expect(sanitizeFileName(input)).toBe(expected);
    });

    it('should allow various valid characters', () => {
      const input = 'file_name-123.@#$^&()[]{}';
      const expected = 'file_name-123.@#$^&()[]{}';
      expect(sanitizeFileName(input)).toBe(expected);
    });

    it ('should handle empty or whitespace-only names', () => {
      const input = '     ';
      const expected = '';
      expect(sanitizeFileName(input)).toBe(expected);
    });
  });

  describe('sanitizeFilePath', () => {
    it('should replace invalid characters with underscores and trim whitespace', () => {
      const input = ' snup/<<<dap/t@pe.md';
      const expected = 'snup/___dap/t@pe.md';
      expect(sanitizeFilePath(input)).toBe(expected);
    });
  });

  describe('isValidPath', () => {
    it('should return false for empty path', () => {
      expect(isValidPath('')).toBe(false);
    });
    it('false for paths with invalid characters', () => {
      expect(isValidPath('invalid<path')).toBe(false);
      expect(isValidPath('invalid>path')).toBe(false);
      expect(isValidPath('invalid:path')).toBe(false);
      expect(isValidPath('invalid"path')).toBe(false);
      expect(isValidPath('invalid|path')).toBe(false);
      expect(isValidPath('invalid?path')).toBe(false);
      expect(isValidPath('invalid*path')).toBe(false);
    });
    it('false for paths navigating outside base directory', () => {
      expect(isValidPath('../outside/path')).toBe(false);
      expect(isValidPath('/absolute/path')).toBe(false);
      expect(isValidPath('snoup/../../outside')).toBe(false);
    });
    it('true for valid relative paths', () => {
      expect(isValidPath('valid/path')).toBe(true);
      expect(isValidPath('another_valid-path123.txt')).toBe(true);
      expect(isValidPath('folder/subfolder/file.md')).toBe(true);
      expect(isValidPath('./file_name.ext')).toBe(true);
      expect(isValidPath('file_name.ext')).toBe(true);
    });
  });

  describe('getFileExtension', () => {
    it('should return the correct file extension', () => {
      expect(getFileExtension('file.txt')).toBe('txt');
      expect(getFileExtension('archive.tar.gz')).toBe('gz');
      expect(getFileExtension('no_extension')).toBe('');
    });
  });

  describe('getValidPathInTape', () => {
    vi.mock('$app/server');
    it('should return a valid path', () => {
      let input = ' snup/<<<dap/t@pe.md';
      let expected ='test-data/testing_tape/snup/___dap/t@pe.md'; 
      expect(getValidPathInTape(input)).toBe(expected);

      input = '../../../im@silly';
      expected = '';
      expect(() => getValidPathInTape(input)).toThrow('Invalid path');

      input = 'valid_path/file.txt';
      expected = 'test-data/testing_tape/valid_path/file.txt';
      expect(getValidPathInTape(input)).toBe(expected);
    });
  });

  describe('getRelativePathFromTape', () => {
    it('should return the correct relative path', () => {
      const input = 'test-data/testing_tape/snup/___dap/t_pe.md';
      const expected = 'snup/___dap/t_pe.md';
      expect(getRelativePathFromTape(input)).toBe(expected);
    });
  });

});
