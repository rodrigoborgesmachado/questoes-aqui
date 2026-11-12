import test from 'node:test';
import assert from 'node:assert/strict';
import { appendComments, MAX_COMMENT_LENGTH, toCommentText, validateComment } from '../src/components/client/QuestionComments/commentUtils.js';

test('line breaks stored as <br/> are shown as plain line breaks', () => {
    assert.equal(toCommentText('linha 1<br/>linha 2<br>linha 3<BR />fim'), 'linha 1\nlinha 2\nlinha 3\nfim');
    assert.equal(toCommentText(), '');
});

test('empty, blank and oversized comments are rejected', () => {
    assert.ok(validateComment(''));
    assert.ok(validateComment('   \n  '));
    assert.ok(validateComment('a'.repeat(MAX_COMMENT_LENGTH + 1)));
    assert.equal(validateComment(`  ${'a'.repeat(MAX_COMMENT_LENGTH)}  `), null);
    assert.equal(validateComment('Boa questão'), null);
});

test('loading more comments keeps order and skips duplicates', () => {
    const current = [{ codigo: 3 }, { codigo: 2 }];
    assert.deepEqual(appendComments(current, [{ codigo: 2 }, { codigo: 1 }]), [{ codigo: 3 }, { codigo: 2 }, { codigo: 1 }]);
});
