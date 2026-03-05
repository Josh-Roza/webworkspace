from django.shortcuts import render
from django.shortcuts import render, redirect, get_object_or_404
from .models import Score
from .forms import ScoreForm


def index(request):
    return render(request, 'index_hello.html')  # Render the index page


def score_view(request):
    # List all scores
    scores = Score.objects.all()

    if request.method == "POST":
        form = ScoreForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('score_view')  # Redirect to the same page
    else:
        form = ScoreForm()

    return render(request, 'score_list.html', {'form': form, 'scores': scores})
    # return render(request, 'score_list_css.html', {'form': form, 'scores': scores})

def edit_score(request, score_id):
    # Edit a specific score
    score = get_object_or_404(Score, id=score_id)

    if request.method == "POST":
        form = ScoreForm(request.POST, instance=score)
        if form.is_valid():
            form.save()
            return redirect('score_view')
    else:
        form = ScoreForm(instance=score)

    return render(request, 'score_edit.html', {'form': form, 'score': score})
    # return render(request, 'score_edit_css.html', {'form': form, 'score': score})

def delete_score(request, score_id):
    # Delete a specific score
    score = get_object_or_404(Score, id=score_id)
    score.delete()
    return redirect('score_view')
