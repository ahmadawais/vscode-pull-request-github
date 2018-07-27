/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { IPullRequestModel, IPullRequestManager } from '../../github/interface';
import { TreeNode } from './treeNode';
import { CommitNode } from './commitNode';

export class CommitsNode extends TreeNode implements vscode.TreeItem {
	public label: string = 'Commits';
	public collapsibleState: vscode.TreeItemCollapsibleState;
	private _prManager: IPullRequestManager;
	private _pr: IPullRequestModel;

	constructor(prManager: IPullRequestManager, pr: IPullRequestModel) {
		super();
		this._pr = pr;
		this._prManager = prManager;
		this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
	}

	getTreeItem(): vscode.TreeItem {
		return this;
	}

	async getChildren(): Promise<TreeNode[]> {
		try {
			const commits = await this._prManager.getPullRequestCommits(this._pr);
			const commitNodes = commits.map(commit => new CommitNode(this._prManager, this._pr, commit));
			return Promise.resolve(commitNodes);
		} catch (e) {
			Promise.resolve([]);
		}
	}
}