/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { Disposable } from 'vs/base/common/lifecycle';
import { IContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import * as modes from 'vs/editor/common/modes';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { EditorContextKeys, ModeContextKeys } from 'vs/editor/common/editorContextKeys';
import { Schemas } from 'vs/base/common/network';

export class EditorModeContext extends Disposable {

	private _editor: ICommonCodeEditor;

	private _langId: IContextKey<string>;
	private _hasCompletionItemProvider: IContextKey<boolean>;
	private _hasCodeActionsProvider: IContextKey<boolean>;
	private _hasCodeLensProvider: IContextKey<boolean>;
	private _hasDefinitionProvider: IContextKey<boolean>;
	private _hasImplementationProvider: IContextKey<boolean>;
	private _hasTypeDefinitionProvider: IContextKey<boolean>;
	private _hasHoverProvider: IContextKey<boolean>;
	private _hasDocumentHighlightProvider: IContextKey<boolean>;
	private _hasDocumentSymbolProvider: IContextKey<boolean>;
	private _hasReferenceProvider: IContextKey<boolean>;
	private _hasRenameProvider: IContextKey<boolean>;
	private _hasDocumentFormattingProvider: IContextKey<boolean>;
	private _hasDocumentSelectionFormattingProvider: IContextKey<boolean>;
	private _hasSignatureHelpProvider: IContextKey<boolean>;
	private _isInWalkThrough: IContextKey<boolean>;

	constructor(
		editor: ICommonCodeEditor,
		contextKeyService: IContextKeyService
	) {
		super();
		this._editor = editor;

		this._langId = EditorContextKeys.LanguageId.bindTo(contextKeyService);
		this._hasCompletionItemProvider = ModeContextKeys.hasCompletionItemProvider.bindTo(contextKeyService);
		this._hasCodeActionsProvider = ModeContextKeys.hasCodeActionsProvider.bindTo(contextKeyService);
		this._hasCodeLensProvider = ModeContextKeys.hasCodeLensProvider.bindTo(contextKeyService);
		this._hasDefinitionProvider = ModeContextKeys.hasDefinitionProvider.bindTo(contextKeyService);
		this._hasImplementationProvider = ModeContextKeys.hasImplementationProvider.bindTo(contextKeyService);
		this._hasTypeDefinitionProvider = ModeContextKeys.hasTypeDefinitionProvider.bindTo(contextKeyService);
		this._hasHoverProvider = ModeContextKeys.hasHoverProvider.bindTo(contextKeyService);
		this._hasDocumentHighlightProvider = ModeContextKeys.hasDocumentHighlightProvider.bindTo(contextKeyService);
		this._hasDocumentSymbolProvider = ModeContextKeys.hasDocumentSymbolProvider.bindTo(contextKeyService);
		this._hasReferenceProvider = ModeContextKeys.hasReferenceProvider.bindTo(contextKeyService);
		this._hasRenameProvider = ModeContextKeys.hasRenameProvider.bindTo(contextKeyService);
		this._hasDocumentFormattingProvider = ModeContextKeys.hasDocumentFormattingProvider.bindTo(contextKeyService);
		this._hasDocumentSelectionFormattingProvider = ModeContextKeys.hasDocumentSelectionFormattingProvider.bindTo(contextKeyService);
		this._hasSignatureHelpProvider = ModeContextKeys.hasSignatureHelpProvider.bindTo(contextKeyService);
		this._isInWalkThrough = ModeContextKeys.isInEmbeddedEditor.bindTo(contextKeyService);

		const update = () => this._update();

		// update when model/mode changes
		this._register(editor.onDidChangeModel(update));
		this._register(editor.onDidChangeModelLanguage(update));

		// update when registries change
		this._register(modes.SuggestRegistry.onDidChange(update));
		this._register(modes.CodeActionProviderRegistry.onDidChange(update));
		this._register(modes.CodeLensProviderRegistry.onDidChange(update));
		this._register(modes.DefinitionProviderRegistry.onDidChange(update));
		this._register(modes.ImplementationProviderRegistry.onDidChange(update));
		this._register(modes.TypeDefinitionProviderRegistry.onDidChange(update));
		this._register(modes.HoverProviderRegistry.onDidChange(update));
		this._register(modes.DocumentHighlightProviderRegistry.onDidChange(update));
		this._register(modes.DocumentSymbolProviderRegistry.onDidChange(update));
		this._register(modes.ReferenceProviderRegistry.onDidChange(update));
		this._register(modes.RenameProviderRegistry.onDidChange(update));
		this._register(modes.DocumentFormattingEditProviderRegistry.onDidChange(update));
		this._register(modes.DocumentRangeFormattingEditProviderRegistry.onDidChange(update));
		this._register(modes.SignatureHelpProviderRegistry.onDidChange(update));

		update();
	}

	dispose() {
		super.dispose();
	}

	reset() {
		this._langId.reset();
		this._hasCompletionItemProvider.reset();
		this._hasCodeActionsProvider.reset();
		this._hasCodeLensProvider.reset();
		this._hasDefinitionProvider.reset();
		this._hasImplementationProvider.reset();
		this._hasTypeDefinitionProvider.reset();
		this._hasHoverProvider.reset();
		this._hasDocumentHighlightProvider.reset();
		this._hasDocumentSymbolProvider.reset();
		this._hasReferenceProvider.reset();
		this._hasRenameProvider.reset();
		this._hasDocumentFormattingProvider.reset();
		this._hasDocumentSelectionFormattingProvider.reset();
		this._hasSignatureHelpProvider.reset();
		this._isInWalkThrough.reset();
	}

	private _update() {
		const model = this._editor.getModel();
		if (!model) {
			this.reset();
			return;
		}
		this._langId.set(model.getLanguageIdentifier().language);
		this._hasCompletionItemProvider.set(modes.SuggestRegistry.has(model));
		this._hasCodeActionsProvider.set(modes.CodeActionProviderRegistry.has(model));
		this._hasCodeLensProvider.set(modes.CodeLensProviderRegistry.has(model));
		this._hasDefinitionProvider.set(modes.DefinitionProviderRegistry.has(model));
		this._hasImplementationProvider.set(modes.ImplementationProviderRegistry.has(model));
		this._hasTypeDefinitionProvider.set(modes.TypeDefinitionProviderRegistry.has(model));
		this._hasHoverProvider.set(modes.HoverProviderRegistry.has(model));
		this._hasDocumentHighlightProvider.set(modes.DocumentHighlightProviderRegistry.has(model));
		this._hasDocumentSymbolProvider.set(modes.DocumentSymbolProviderRegistry.has(model));
		this._hasReferenceProvider.set(modes.ReferenceProviderRegistry.has(model));
		this._hasRenameProvider.set(modes.RenameProviderRegistry.has(model));
		this._hasSignatureHelpProvider.set(modes.SignatureHelpProviderRegistry.has(model));
		this._hasDocumentFormattingProvider.set(modes.DocumentFormattingEditProviderRegistry.has(model) || modes.DocumentRangeFormattingEditProviderRegistry.has(model));
		this._hasDocumentSelectionFormattingProvider.set(modes.DocumentRangeFormattingEditProviderRegistry.has(model));
		this._isInWalkThrough.set(model.uri.scheme === Schemas.walkThroughSnippet);
	}
}
