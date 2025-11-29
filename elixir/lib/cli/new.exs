defmodule AdventOfCode.Cli.New do
  @moduledoc """
  CLI to fetch a single task
  """

  alias AdventOfCode.Cli.Utils.SolutionHelper

  @template_folder "template"

  def main() do
    {year, task} = get_task(System.argv())
    create_folder(year, task)
    copy_template(year, task)
  end

  defp get_task(argv) do
    {input, _, _} =
      OptionParser.parse(argv,
        strict: [task: :string],
        aliases: [t: :task]
      )

    task_input =
      input
      |> Keyword.get(:task, "")
      |> String.trim()
      |> case do
        "" ->
          IO.puts("must select task (use --task YEAR/TASK)")
          System.halt(1)

        value ->
          value
      end

    case String.split(task_input, "/") do
      [year, task] ->
        {year, task}

      _ ->
        IO.puts("invalid --task format: #{task_input}. Expected YEAR/TASK")
        System.halt(1)
    end
  end

  defp create_folder(year, task) do
    IO.puts("Creating new task folder...")
    solution_path = SolutionHelper.get_path(year, task)

    if File.dir?(solution_path) do
      IO.puts("Task folder already exists at #{solution_path}")
    else
      File.mkdir_p!(solution_path)
      IO.puts("Created folder at #{solution_path}")
    end
  end

  defp copy_template(year, task) do
    IO.puts("Copying template files...")
    solution_path = SolutionHelper.get_path(year, task)

    @template_folder
    |> File.ls!()
    |> Enum.each(fn filename ->
      template_path = Path.join([@template_folder, filename])
      destination_file = Path.join([solution_path, filename])

      if File.exists?(destination_file) do
        IO.puts("Solution file already exists at #{destination_file}")
      else
        File.cp!(template_path, destination_file)
        IO.puts("Copied template to #{destination_file}")
      end
    end)
  end
end

AdventOfCode.Cli.New.main()
