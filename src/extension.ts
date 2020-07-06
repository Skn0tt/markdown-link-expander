import * as vscode from "vscode";
import { fetchTitle } from "./fetchTitle";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "markdown-link-expander.expand",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
			let url = document.getText(selection);

			if (!url.startsWith("http")) {
				url = "https://" + url;
			}

      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: "Fetching title ..." },
        async () => {
          try {
            const title = await fetchTitle(url);
            const markdownLink = `[${title}](${url})`;
            editor.edit((editBuilder) => {
              editBuilder.replace(selection, markdownLink);
            });
          } catch (error) {
            vscode.window.showErrorMessage("Failed to fetch title.");
          }
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
