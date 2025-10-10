import Header from "@/components/manage/header";

export default function ManagePage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Header />

      {/* Sample Questions Download Link */}
      <div className="flex justify-end">
        <a
          href="/sample_questions.xlsx"
          download
          className="text-muted-foreground text-xs hover:underline"
        >
          Getting Started? Download Sample Questions .xlsx
        </a>
      </div>

      {/* Tags Section */}
      {/* <Tags
        tags={tags}
        onUpdateTag={(tag) => {
          updateTag(tag.id, { name: tag.name, color: tag.color });
          setTags(getTags());
        }}
        onDeleteTag={handleDeleteTag}
        onReorderTags={(newTags) => {
          saveTags(newTags);
          setTags(newTags);
        }}
        colorOptions={[]}
      /> */}

      {/* Questions Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{question.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <a
                          href={question.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {question.url}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={getDifficultyBadgeVariant(question.difficulty)}
                      >
                        {question.difficulty}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {question.tags.map((tagId) => {
                          const tag = tags.find((t) => t.id === tagId);
                          return tag ? (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className={cn("text-primary")}
                            >
                              {tag.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => setEditingQuestion(question)}
                        variant="ghost"
                        size="sm"
                        className="mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteQuestion(question.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card> */}

      {/* Edit Question Dialog */}
      {/* {editingQuestion && (
        <Dialog
          open={!!editingQuestion}
          onOpenChange={() => setEditingQuestion(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Question name"
                value={editingQuestion.name}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    name: e.target.value,
                  })
                }
              />
              <Input
                type="url"
                placeholder="Question URL"
                value={editingQuestion.url}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    url: e.target.value,
                  })
                }
              />
              <Select
                value={editingQuestion.difficulty}
                onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                  setEditingQuestion({ ...editingQuestion, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={editingQuestion.tags.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          const newTags = checked
                            ? [...editingQuestion.tags, tag.id]
                            : editingQuestion.tags.filter((t) => t !== tag.id);
                          setEditingQuestion({
                            ...editingQuestion,
                            tags: newTags,
                          });
                        }}
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleUpdateQuestion} className="flex-1">
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingQuestion(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )} */}

      {/* Edit Tag Dialog */}
      {/* {editingTag && (
        <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewTagColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        color,
                        newTagColor === color
                          ? "border-foreground"
                          : "border-border"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleUpdateTag} className="flex-1">
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTag(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )} */}
    </div>
  );
}
